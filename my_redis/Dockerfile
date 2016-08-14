FROM ubuntu:trusty
MAINTAINER Alan Tai <gogistics@gogistics-tw.com>

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv C7917B12 && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y redis-server pwgen && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add scripts
ADD run.sh /run.sh

# Make file executable
RUN chmod +x /run.sh

ENV REDIS_PASS **Random**
ENV REDIS_DIR /data/kue-redis
VOLUME ["/data/kue-redis"]

EXPOSE 6379
CMD ["/run.sh"]
