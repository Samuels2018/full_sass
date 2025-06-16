package main

import (
	"fmt"
	"sass-orders-service/config"
	"sass-orders-service/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	config.ConnectionDB()

	routes.RegisterOrderRoutes(router)
	if err := router.Run(":8080"); err != nil {
		panic(err)
	}
	fmt.Println("Server running on port 8080")
}
