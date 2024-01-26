package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"
	"time"
)

type Command string

const (
	INIT     Command = "init"
	NEW_CERT Command = "new-cert"
)

func main() {
	command := Command("")
	if len(os.Args) > 1 {
		command = Command(os.Args[1])
	}

	if command == INIT {
		fmt.Println("Generate the PKI CA")
		generateX509Certificate()
	} else if command == NEW_CERT {
		fmt.Println("Generate new certificate key pair")
	} else {
		printHelp()
	}
}

func getx509CertTemplate(days int) x509.Certificate {
	return x509.Certificate{
		Version:      3,
		SerialNumber: big.NewInt(int64(time.Now().Second())),
		NotBefore:    time.Now(),
		NotAfter:     time.Now().Add(time.Hour * 24 * time.Duration(days)),
		Subject: pkix.Name{
			Country:      []string{"Bangladesh"},
			Organization: []string{"asys.co"},
			CommonName:   "asys.co",
		},
		Issuer: pkix.Name{
			Country:      []string{"Bangladesh"},
			Organization: []string{"asys.co"},
			CommonName:   "asys.co",
		},
		KeyUsage:        x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtraExtensions: []pkix.Extension{},
	}
}

func generateX509Certificate() {
	private, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		fmt.Printf("%s\n", err)
	}

	b := pem.EncodeToMemory(&pem.Block{Bytes: private.N.Bytes()})
	b2 := pem.EncodeToMemory(&pem.Block{Type: "PUBLIC KEY", Bytes: private.PublicKey.N.Bytes()})

	fmt.Println(string(b))
	fmt.Println(b2)

	certTemplate := getx509CertTemplate(365)

	certBytes, err := x509.CreateCertificate(rand.Reader, &certTemplate, &certTemplate, private.Public(), private)

	if err != nil {
		fmt.Printf("Error happened %s \n", err)
	}

	certFile, err := os.Create("text-x509.pem")

	defer func() {
		fmt.Println("closing file")
		err := certFile.Close()
		if err != nil {
			fmt.Printf("Error happened %s \n", err)
		}
	}()

	if err != nil {
		fmt.Printf("Error happened %s \n", err)
	}

	err = pem.Encode(certFile, &pem.Block{Type: "CERTIFICATE", Bytes: certBytes})
	if err != nil {
		fmt.Printf("Error happened %s \n", err)
	}
	fmt.Println("A x509 Certificate has been created")
}

func printHelp() {
	fmt.Println("Printing help message")
}
