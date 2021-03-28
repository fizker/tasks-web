#############################


FROM node:erbium-alpine as client
WORKDIR /root

# Copying files required for installing dependencies. We do this first, because
# dependencies change less often than app code, and this way, we leverage docker caching
# as much as possible
COPY package*.json ./

RUN npm install

# Copy the rest of the code in. Remember to add tests, node_modules and other non-essentials to `.dockerignore`
COPY . .

### This is where webpack is building. Alter as necessary
#RUN npx webpack


#############################


FROM fizker/serve-prepare as builder
WORKDIR /root

# Copy the setup-request
COPY serve-setup-request.json ./serve-setup-request.json

# Copy the client code.
COPY --from=client /root/static ./target

# This makes it possible to skip compression by adding `--build-arg skip_compression=true` to the `docker build` command
ARG skip_compression=false
ENV -e SERVE_SKIP_COMPRESSION=$skip_compression

# Execute the build
RUN serve-prepare build --request=serve-setup-request.json --target=target --output=output


#############################


# Production image

FROM fizker/serve
WORKDIR /root

# Copy the pre-built files in
COPY --from=builder /root/output ./output

ENV PORT=80 HTTPS_PORT=443
ENTRYPOINT [ "serve", "output/setup.json" ]


#############################
