server {
    listen 80;
    server_name archiecairns.com www.archiecairns.com;
    root /usr/share/nginx/archiecairns

#    access_log /var/log/nginx/archiecairns-access.log;
#    error_log /var/log/nginx/archiecairns-error.log
}
