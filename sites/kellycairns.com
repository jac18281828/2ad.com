server {
    listen 80;
    server_name kellycairns.com www.kellycairns.com;
    root /usr/share/nginx/kellycairns

#    access_log /var/log/nginx/kellycairns-access.log;
#    error_log /var/log/nginx/kellycairns-error.log
}
