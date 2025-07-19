package models

type Message struct {
    ID        int    `db:"id"`
    Username  string `db:"username"`
    Content   string `db:"content"`
    CreatedAt string `db:"created_at"`
}
