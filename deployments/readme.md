# Nginx reverse proxy deployment: Linux VPS

## Nginx installation

```shell
sudo apt update && sudo apt install nginx
```

```shell
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Nginx setup

1. Create a new nginx configuration file in `sites-available`:

```shell
sudo nano /etc/nginx/sites-available/my-project
```

2. Basic config file template:

```bash
    server {
        listen 80;
        server_name <your-vps-ip>;  # Or your domain name

        location / {
            proxy_pass http://localhost:8080;  # Forward to your Docker app
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
```

3. Create a configuration link:

```shell
sudo ln -s /etc/nginx/sites-available/my-project /etc/nginx/sites-enabled/
```

4. Test the configuration:

```shell
sudo nginx -t
```

5. Apply newest configuration:

```shell
sudo systemctl reload nginx
```

6. Verify nginx status:

```shell
sudo systemctl status nginx
```

## Adding SSL termination to nginx

### Getting certificates

1. Install certbot:
   ```shell
   sudo apt install certbot python3-certbot-nginx
   ```
2. Generate SSL Certificate:
   ```shell
   sudo certbot --nginx -d <your-domain>
   ```
3. Automatic renewal:
   ```shell
   sudo certbot renew --dry-run
   ```

### Updating basic configuration

1. Update the configuration file in `sites-available` adding the SSL server block. Template example:

```bash
    server {
        listen 80;
        server_name <your-vps-ip>; # or DOMAIN NAME

        # Redirect HTTP to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name <your-vps-ip>;

        ssl_certificate /etc/letsencrypt/live/my-project.be/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/my-project.be/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDH+AESGCM:ECDH+AES256:ECDH+AES128:!aNULL:!MD5:!RC4';
        ssl_prefer_server_ciphers on;

        location /  {
            proxy_pass http://localhost:3030; # Forward to service to host
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

    }
```

### Others

To clear the logs and erros (by leaving files intact)

```shell
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log
```
