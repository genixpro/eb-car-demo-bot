# This builds an all-in-one easy to install dockerfile

FROM       node:6.11.3
MAINTAINER Electric Brain <info@electricbrain.io>

# Install some basic system dependencies
RUN apt-get update
RUN apt-get install gcc g++ git wget sudo vim python3 python3-pip -y
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install the package
RUN npm install

# Setup and configure systemd
ENTRYPOINT ["npm", "start"]

EXPOSE 80

