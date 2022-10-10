package main

import (
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type login struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}
type Order struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Cost      string `json:"cost"`
	IssueDate string `json:"issuedate"`
	Accepted  string `json:"accepted"`
}

var orders = []Order{
	{ID: "5478", Title: "Elektro", Cost: "2000", IssueDate: "8/9/22", Accepted: "null"},
	{ID: "2157", Title: "Lešení", Cost: "5000", IssueDate: "2/9/22", Accepted: "null"},
	{ID: "2178", Title: "Synthesia", Cost: "10000", IssueDate: "7/8/22", Accepted: "true"},
	{ID: "2154", Title: "Betonarka", Cost: "1500", IssueDate: "7/8/22", Accepted: "false"},
}

var identityKey = "id"

func helloHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	user, _ := c.Get(identityKey)
	c.JSON(200, gin.H{
		"userID":   claims[identityKey],
		"userName": user.(*User).UserName,
		"text":     "Hello World.",
	})
}
func ordersHandler(c *gin.Context) {
	c.JSON(200, orders)
}
func checkHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pass",
	})
}

func LogoutHandler(c *gin.Context) {
	c.SetCookie("jwt", "jwt", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello World!",
	})
}

// User demo
type User struct {
	UserName  string
	FirstName string
	LastName  string
}

func main() {
	port := os.Getenv("PORT")
	r := gin.Default()

	if port == "" {
		port = "8000"
	}
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://127.0.0.1:3000"}
	config.AllowHeaders = []string{"Origin, X-Requested-With, Content-Type, Accept, Authorization"}
	config.AllowCredentials = true
	config.AllowMethods = []string{"GET,PUT,POST,DELETE,PATCH,OPTIONS"}

	// config.AllowOrigins = []string{"http://google.com", "http://facebook.com"}
	// config.AllowAllOrigins = true

	r.Use(cors.New(config))

	// the jwt middleware
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "test zone",
		Key:         []byte("kIHicpwIZ2DRS4M7D2GI5UrnaKX6zGeu"),
		Timeout:     time.Second * 10,
		MaxRefresh:  time.Hour * 24 * 7,
		IdentityKey: identityKey,
		PayloadFunc: func(data interface{}) jwt.MapClaims {
			if v, ok := data.(*User); ok {
				return jwt.MapClaims{
					identityKey: v.UserName,
				}
			}
			return jwt.MapClaims{}
		},
		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			return &User{
				UserName: claims[identityKey].(string),
			}
		},
		Authenticator: func(c *gin.Context) (interface{}, error) {
			var loginVals login
			if err := c.ShouldBind(&loginVals); err != nil {
				return "", jwt.ErrMissingLoginValues
			}
			userID := loginVals.Username
			password := loginVals.Password

			if (userID == "admin" && password == "admin") || (userID == "test" && password == "test") {
				return &User{
					UserName:  userID,
					LastName:  "Bo-Yi",
					FirstName: "Wu",
				}, nil
			}

			return nil, jwt.ErrFailedAuthentication
		},
		Authorizator: func(data interface{}, c *gin.Context) bool {
			if v, ok := data.(*User); ok && v.UserName == "admin" {
				return true
			}

			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "param:<name>"

		SendCookie:     true,
		SecureCookie:   false, //non HTTPS dev environments
		CookieHTTPOnly: true,  // JS can't modify
		// CookieDomain:   "localhost:3000",
		CookieDomain: "localhost:3000",
		CookieName:   "jwt", // default jwt
		CookieMaxAge: 60 * 60 * 24 * 7,

		//TokenLookup: "header: Authorization, query: token, cookie: jwt", // accepting
		// TokenLookup: "query:token",
		TokenLookup: "cookie:jwt",

		// TokenHeadName is a string in the header. Default value is "Bearer"
		TokenHeadName: "Bearer",

		// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	})

	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	// When you use jwt.New(), the function is already automatically called for checking,
	// which means you don't need to call it again.
	errInit := authMiddleware.MiddlewareInit()

	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
	}

	// r.GET("/test", func(c *gin.Context) {
	// 	c.SetCookie("CooksGoodsss", "name", 10000, "/", "localhost", false, true)
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"message": "Hello World!",
	// 	})
	// })

	r.GET("/test", func(c *gin.Context) {
		//	fmt.Println(c.Cookie("jwt"))
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello World!",
		})
	})
	r.GET("/logout", LogoutHandler)
	r.POST("/login", authMiddleware.LoginHandler)
	r.NoRoute(authMiddleware.MiddlewareFunc(), func(c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		log.Printf("NoRoute claims: %#v\n", claims)
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	auth := r.Group("/auth")
	// Refresh time can be longer than token timeout
	auth.GET("/refresh_token", authMiddleware.RefreshHandler)
	auth.Use(authMiddleware.MiddlewareFunc())
	{
		auth.GET("/hello", helloHandler)
		auth.GET("/orders", ordersHandler)
		auth.GET("/check", checkHandler)
		// auth.GET("/logout", LogoutHandler)
		// auth.GET("/logout", LogoutHandler)
	}

	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
	r.Run()
}
