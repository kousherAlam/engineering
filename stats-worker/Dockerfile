FROM alpine:3.19.0 as builder
WORKDIR /build
RUN apk add --no-cache go gcc g++
COPY ./docker-go ./code
WORKDIR /build/code
RUN go mod tidy
RUN env CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o /build/worker .

FROM alpine:3.19.0
WORKDIR /build 
COPY --from=builder /build/worker /build/worker
CMD ["/build/worker"]

