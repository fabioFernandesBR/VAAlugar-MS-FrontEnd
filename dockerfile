# Use a imagem oficial do Nginx como base
FROM nginx:alpine

# Remova a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copie o arquivo de configuração personalizado do Nginx para o container
COPY nginx.conf /etc/nginx/conf.d

# Copie os arquivos estáticos da aplicação para o diretório raiz do Nginx
COPY . /usr/share/nginx/html

# Exponha a porta que o Nginx vai rodar
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
