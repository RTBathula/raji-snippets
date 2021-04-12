# Express REST with Mock data

# Getting Started
Fork and clone the repository. Install dependencies with:

```
npm install
```

# Run the server
After completing the above steps run your node.js server

```
npm start
```

This will run the server on port 8081

## API Usage

1. http://localhost:8081/products?skip=0&limit=30&sort=email:desc

Defaults
```
skip = 0;
limit = 30;
sort = first_name:asc (this will be splited by ':' to get column and order)
```

2. http://localhost:8081/cars/year?valid_from=1980

Defaults
```
valid_from=1991
```


