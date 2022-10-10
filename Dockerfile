FROM node:10

WORKDIR /app
COPY . .

#RUN npm i yarn
#RUN yarn global add @angular/cli@latest
# RUN npm install -g @angular/cli

# RUN yarn && yarn add moment && yarn add vis-util && npm run build --prod --build-optimizer
RUN yarn && yarn add moment && yarn add vis-util 
# RUN ./node_modules/@angular/cli/bin/ng build --prod --build-optimizer --outputPath=dist/www/en --baseHref=/ --i18nLocale=en --verbose=true
# RUN ./node_modules/@angular/cli/bin/ng build --prod --build-optimizer --output-path=dist/www/hi --baseHref /hi --i18nLocale=hi  --verbose=true --i18n-format xlf --i18n-file locale/messages.hi.xlf
RUN npm run build
RUN npm run build:hi  
RUN npm run compress:brotli
#RUN npm run compress:gzip

WORKDIR /app/dist
COPY assets/iGOT/client-assets/dist www/en/assets
COPY assets/iGOT/client-assets/dist www/hi/assets
RUN npm install --production
EXPOSE 3004

CMD [ "npm", "run", "serve:prod" ]

