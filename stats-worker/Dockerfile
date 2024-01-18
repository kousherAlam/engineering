

FROM golang:1.21.6 AS builder
# Next line is just for debug
RUN ldd --version
WORKDIR /build
COPY ./stats-worker/go.mod ./stats-worker/go.sum ./
RUN go mod download && go mod verify
COPY ./stats-worker .
WORKDIR /build/cmd
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o go-binary

# Production phase
FROM alpine:3.14
# Next line is just for debug
RUN ldd; exit 0
WORKDIR /app
COPY --from=builder /build/cmd/go-binary .
ENTRYPOINT [ "/app/go-binary"]