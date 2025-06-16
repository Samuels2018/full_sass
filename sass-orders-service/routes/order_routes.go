package routes

import (
	"sass-orders-service/controllers"
	"sass-orders-service/helpers"

	"github.com/gin-gonic/gin"
)

func RegisterOrderRoutes(router *gin.Engine) {
	orderController := controllers.NewOrderController()

	orders := router.Group("/orders")
	{
		orders.GET("/", helpers.AuthMiddleware, orderController.GetUserOrders)
		orders.POST("/", helpers.AuthMiddleware, orderController.CreateOrder)
		orders.GET("/:id", helpers.AuthMiddleware, orderController.GetOrderDetails)
		orders.DELETE("/:id", helpers.AuthMiddleware, orderController.CancelOrder)
	}
}
