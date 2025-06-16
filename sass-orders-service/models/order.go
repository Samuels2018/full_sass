package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID    string             `json:"user_id" bson:"user_id" binding:"required"`
	Items     []OrderItems       `json:"items" bson:"items" binding:"required"`
	Status    string             `json:"status" bson:"status"` // e.g., "pending", "completed", "cancelled"
	Total     float64            `json:"total" bson:"total"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}

type OrderItems struct {
	ProductID string  `json:"product_id" bson:"product_id" binding:"required"`
	Quantity  int     `json:"quantity" bson:"quantity" binding:"required"`
	Price     float64 `json:"price" bson:"price" binding:"required"`
}
