package telehealth

import (
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	Hub  *Hub
	Conn *websocket.Conn
	Send chan []byte
	Role string
}

type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
	Vets       map[*Client]bool
	Users      map[*Client]bool
	Mutex      sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Vets:       make(map[*Client]bool),
		Users:      make(map[*Client]bool),
	}
}

var globalHub = NewHub()

func init() {
	go globalHub.Run()
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Mutex.Lock()
			h.Clients[client] = true
			if client.Role == "VET" {
				h.Vets[client] = true
			} else {
				h.Users[client] = true
			}
			h.Mutex.Unlock()
			h.notifyStatus(client)

		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				h.Mutex.Lock()
				delete(h.Clients, client)
				delete(h.Vets, client)
				delete(h.Users, client)
				close(client.Send)
				h.Mutex.Unlock()
			}

		case message := <-h.Broadcast:
			h.Mutex.Lock()
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
			h.Mutex.Unlock()
		}
	}
}

func (h *Hub) notifyStatus(c *Client) {
	h.Mutex.Lock()
	vetCount := len(h.Vets)
	h.Mutex.Unlock()

	if vetCount == 0 && c.Role != "VET" {
		c.Send <- []byte("Status: Waiting for Veterinarian...")
	} else if vetCount > 0 && c.Role != "VET" {
		c.Send <- []byte("Status: Veterinarian is online.")
	}
}

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()
	c.Conn.SetReadLimit(512)
	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error { c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second)); return nil })
	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		c.Hub.Broadcast <- message
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	role := r.URL.Query().Get("role")
	if role == "" {
		role = "USER"
	}

	client := &Client{Hub: globalHub, Conn: conn, Send: make(chan []byte, 256), Role: role}
	client.Hub.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
