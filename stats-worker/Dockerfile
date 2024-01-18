FROM golang:1.21.6
WORKDIR /build
COPY ./stats-worker .
RUN go build -o go-binary .
ENTRYPOINT [ "/build/go-binary"]