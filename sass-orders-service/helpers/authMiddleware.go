package helpers

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

type Claims struct {
	useranme string `json:"username"`
	jwt.RegisteredClaims
}

var db *sql.DB

func initDB() {
	var err error
	dbUser := os.Getenv("DB_USER_JWT")
	dbPassword := os.Getenv("DB_PASSWORD_JWT")
	dbName := os.Getenv("DB_DB_NAME_JWTNAME")
	dbHost := os.Getenv("DB_HOST_JWT")
	dbPort := os.Getenv("DB_PORT_JWT")

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=disable",
		dbUser, dbPassword, dbName, dbHost, dbPort)

	db, err = sql.Open("postgres", connStr)

	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Error pinging the database: %v", err)
	}
	fmt.Println("Connected to the database successfully!")
}

func validateToken(tokenString string, jwtSecret []byte) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("error parsing token: %v", err)
	}

	if Claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return Claims, nil
	} else {
		return nil, fmt.Errorf("invalid token")
	}
}

func AuthMiddleware(c *gin.Context) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	jwtSecret := []byte(os.Getenv(os.Getenv("JWT_SECRET")))

	initDB()
	defer db.Close()

	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.JSON(401, gin.H{"error": "Authorization header is required"})
		c.Abort()
		return
	}

	Claims, err := validateToken(tokenString, jwtSecret)
	if err != nil {
		c.JSON(401, gin.H{"error": "Invalid token: " + err.Error()})
		c.Abort()
		return
	}
	c.Set("user", Claims.useranme)
	c.Next()
	log.Println("User authenticated:", Claims.useranme)
}
