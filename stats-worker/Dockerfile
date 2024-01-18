FROM golang:1.21.6 as builder
WORKDIR /src
COPY ./stats-worker .
RUN go build -o /bin/worker .

FROM scratch
COPY --from=builder /bin/worker /bin/worker
CMD ["/bin/worker"]
