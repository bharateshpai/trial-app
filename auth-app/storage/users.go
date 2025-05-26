package storage

import (
	"encoding/json"
	"errors"
	"os"
	"sync"
	"time"
)

type User struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	Email        string `json:"email"`
	ResetToken   string `json:"resetToken,omitempty"`
	TokenExpires int64  `json:"tokenExpires,omitempty"`
}

type UserStore struct {
	Users map[string]User `json:"users"`
	mu    sync.RWMutex
	file  string
}

func NewUserStore(filename string) (*UserStore, error) {
	store := &UserStore{
		Users: make(map[string]User),
		file:  filename,
	}

	// Create the file if it doesn't exist
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		err = store.save()
		if err != nil {
			return nil, err
		}
		return store, nil
	}

	// Load existing users
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	if len(data) > 0 {
		err = json.Unmarshal(data, store)
		if err != nil {
			return nil, err
		}
	}

	return store, nil
}

func (s *UserStore) Save() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.save()
}

func (s *UserStore) save() error {
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.file, data, 0644)
}

func (s *UserStore) AddUser(username, hashedPassword, email string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.Users[username] = User{
		Username: username,
		Password: hashedPassword,
		Email:    email,
	}
	return s.save()
}

func (s *UserStore) GetUser(username string) (User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, exists := s.Users[username]
	return user, exists
}

func (s *UserStore) GetUserByEmail(email string) (User, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, user := range s.Users {
		if user.Email == email {
			return user, true
		}
	}
	return User{}, false
}

func (s *UserStore) SetResetToken(username, token string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	user, exists := s.Users[username]
	if !exists {
		return errors.New("user not found")
	}

	user.ResetToken = token
	user.TokenExpires = time.Now().Add(15 * time.Minute).Unix()
	s.Users[username] = user
	return s.save()
}

func (s *UserStore) ValidateResetToken(username, token string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, exists := s.Users[username]
	if !exists {
		return false
	}

	if user.ResetToken != token {
		return false
	}

	if time.Now().Unix() > user.TokenExpires {
		return false
	}

	return true
}

func (s *UserStore) UpdatePassword(username, hashedPassword string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	user, exists := s.Users[username]
	if !exists {
		return errors.New("user not found")
	}

	user.Password = hashedPassword
	user.ResetToken = ""
	user.TokenExpires = 0
	s.Users[username] = user
	return s.save()
} 