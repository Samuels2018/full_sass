package repositories

import (
	"context"
	"sass-orders-service/config"
	"sass-orders-service/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderRepository struct {
	collection *mongo.Collection
}

func NewOrderRepository() *OrderRepository {
	return &OrderRepository{
		collection: config.DB.Collection("orders"),
	}
}

func (r *OrderRepository) Create(order *models.Order) (*models.Order, error) {
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	res, err := r.collection.InsertOne(context.Background(), order)

	if err != nil {
		return nil, err
	}

	order.ID = res.InsertedID.(primitive.ObjectID)
	return order, nil
}

func (r *OrderRepository) FindByUserID(userID string) ([]models.Order, error) {
	var orders []models.Order

	cursor, err := r.collection.Find(context.Background(), map[string]string{"user_id": userID})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var order models.Order

		if err := cursor.Decode(&order); err != nil {
			return nil, err
		}

		orders = append(orders, order)
	}

	return orders, nil
}

func (r *OrderRepository) FindById(id string) (*models.Order, error) {
	objID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return nil, err
	}

	var order models.Order

	err = r.collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&order)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No order found
		}
		return nil, err // Other error
	}

	return &order, nil
}

func (r *OrderRepository) Delete(id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(context.Background(), bson.M{"_id": objID})
	return err
}
