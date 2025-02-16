FROM cypress/included:13.15.2
COPY cypress.config.js /opt/app/
COPY cypress /opt/app/cypress
RUN yarn add @4tw/cypress-drag-drop@2.2.5
WORKDIR /opt/app