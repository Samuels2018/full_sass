package controllers

import (
	"net/http"
	"sass-orders-service/models"
	"sass-orders-service/repositories"

	"github.com/gin-gonic/gin"
)

type OrderController struct {
	repo *repositories.OrderRepository
}

func NewOrderController() *OrderController {
	return &OrderController{
		repo: repositories.NewOrderRepository(),
	}
}

func (c *OrderController) GetUserOrders(ctx *gin.Context) {
	userID := ctx.GetString("user_id") // Asumiendo que el user_id se establece en un middleware de autenticación

	orders, err := c.repo.FindByUserID(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, orders)
}

func (c *OrderController) CreateOrder(ctx *gin.Context) {
	var order models.Order
	if err := ctx.ShouldBindJSON(&order); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Establecer el user_id desde el contexto de autenticación
	order.UserID = ctx.GetString("user_id")

	// Calcular el total
	order.Total = 0
	for _, item := range order.Items {
		order.Total += item.Price * float64(item.Quantity)
	}

	createdOrder, err := c.repo.Create(&order)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, createdOrder)
}

func (c *OrderController) GetOrderDetails(ctx *gin.Context) {
	id := ctx.Param("id")

	order, err := c.repo.FindById(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Verificar que el pedido pertenece al usuario
	userID := ctx.GetString("user_id")
	if order.UserID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to view this order"})
		return
	}

	ctx.JSON(http.StatusOK, order)
}

func (c *OrderController) CancelOrder(ctx *gin.Context) {
	id := ctx.Param("id")

	// Primero verificar que el pedido existe y pertenece al usuario
	order, err := c.repo.FindById(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	userID := ctx.GetString("user_id")
	if order.UserID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to cancel this order"})
		return
	}

	// Solo permitir cancelar pedidos en estado "created" o "processing"
	if order.Status != "created" && order.Status != "processing" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Order cannot be cancelled at this stage"})
		return
	}

	err = c.repo.Delete(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Order cancelled successfully"})
}
