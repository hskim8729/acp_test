FROM nginx:1.25.3
ENV TZ="Asia/Seoul"
COPY dist /usr/share/nginx/html
# https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
RUN sed -i '/location \/ {/a \        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf
RUN sed -i '/http {/a \    client_max_body_size 100M;' /etc/nginx/nginx.conf