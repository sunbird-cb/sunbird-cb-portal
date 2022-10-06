FROM node:10

WORKDIR /app
COPY . .

#RUN npm i yarn
#RUN yarn global add @angular/cli@latest
RUN npm install -g @angular/cli

# RUN yarn && yarn add moment && yarn add vis-util && npm run build --prod --build-optimizer
RUN yarn && yarn add moment && yarn add vis-util 
RUN ng build --prod --build-optimizer --outputPath=dist/www/en --baseHref=/ --i18nLocale=en --verbose=true
RUN ng build --prod --build-optimizer --i18n-locale hi --i18n-format xlf --i18n-file locale/messages.hi.xlf --output-path=dist/www/hi --baseHref /hi/
RUN npm run compress:brotli
#RUN npm run compress:gzip

WORKDIR /app/dist
COPY assets/iGOT/client-assets/dist www/en/assets
RUN npm install --production
EXPOSE 3004

CMD [ "npm", "run", "serve:prod" ]

