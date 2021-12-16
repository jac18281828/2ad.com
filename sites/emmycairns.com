server {
    listen 80;
    server_name emmycairns.com www.emmycairns.com;
    root /usr/share/nginx/emmycairns

#    access_log /var/log/nginx/emmycairns-access.log;
#    error_log /var/log/nginx/emmycairns-error.log
}
