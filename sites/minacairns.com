server {
    listen 80;
    server_name minacairns.com www.minacairns.com;
    root /usr/share/nginx/minacairns

#    access_log /var/log/nginx/minacairns-access.log;
#    error_log /var/log/nginx/minacairns-error.log
}
