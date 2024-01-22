FROM golang:1.21.6 as builder
WORKDIR /build
COPY ./stats-worker ./code
WORKDIR /build/code
RUN go mod tidy
RUN env GOOS=linux GOARCH=amd64 go build -o /build/worker .

FROM alpine:3.19.0
WORKDIR /build 
COPY --from=builder /build/worker /build/worker
CMD ["/build/worker"]

