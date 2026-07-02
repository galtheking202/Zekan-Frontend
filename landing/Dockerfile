FROM nginx:alpine
COPY landing/index.html   /usr/share/nginx/html/index.html
COPY landing/privacy.html /usr/share/nginx/html/privacy.html
COPY landing/contact.html /usr/share/nginx/html/contact.html
COPY landing/og-image.svg /usr/share/nginx/html/og-image.svg
COPY landing/script.js    /usr/share/nginx/html/script.js
COPY landing/robots.txt   /usr/share/nginx/html/robots.txt
COPY landing/badges/      /usr/share/nginx/html/badges/
COPY landing/shots/       /usr/share/nginx/html/shots/
COPY landing/nginx.conf   /etc/nginx/templates/default.conf.template
