# DotDB - Leightweight Local JSON Database
DotDB is a easy to use and leightweight local database that uses JSON to store data. It also supports different "directories" by usings dots. [See this.](#what-are-dot-directories)  
You can install it by running:

```sh
npm install dotdatabase
```
The NPM package can be found [here](https://www.npmjs.com/package/dotdatabase).  
  
Current Version: `1.1.2` (Stable Version)

# Getting started

To create a database, you need to import dotdb and create a new instance of the class.

```typescript
import DotDB from "dotdatabase";

const database = new DotDB("path/to/your/db.json"); // Directories
// OR
const database = new DotDB("db.json"); // In the root directory
```

# Methods

There are ten different methods to use.  
`set, multiset, delete, multidelete, get, has, keys, values, all, clear`  
  
All the tutorials below will assume that the db is:
```json
{
    "1": "2",
    "key": "value",
    "user_723": {
        "name": "John Doe",
        "age": 30,
        "email": "johndoe@example.com",
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip": "12345"
        }
    }
}
```
  
### Set and Multiset

`set` allows you to set a key to a value in the database
```typescript
database.set("k", "v")
```
`multiset` allows you to set multiple keys and values at once
```typescript
database.multiset({ "k": "v", "k2": "v2" })
```

### Delete and Multidelete
`delete` allows you to remove a key from the database
```typescript
database.delete("key")
```
`multidelete` allows you to delete multiple keys at once
```typescript
database.multidelete(["1", "key", "user_723"])
```

### Get and Has
`get` allows you to get a value from a key from the database.  
Make sure to use await before.
```typescript
const value = await database.get("key")
console.log(value) // -> "value"
```
`has` allows you to check if a key-value pair exists in the database and returns true if it exists and false if not. Make sure to use await before.
```typescript
console.log( await database.has("key") ); // -> true
console.log( await database.has("abc") ); // -> false
```

### Keys and Values
`keys` allows you to get all keys from the database.  
Make sure to use await before.
```typescript
console.log( await database.keys() ); // ->
// [
//   '1',
//   'key',
//   'user_723.name',
//   'user_723.age',
//   'user_723.email',
//   'user_723.address.street',
//   'user_723.address.city',
//   'user_723.address.state',
//   'user_723.address.zip'
// ]
```
`values` allows you to get all values from the database.  
Make sure to use await before
```typescript
console.log( await database.values() ); // ->
// [
//   '2',
//   'value',
//   'John Doe',
//   30,
//   'johndoe@example.com',
//   '123 Main St',
//   'Anytown',
//   'CA',
//   '12345'
// ]
```

### All and Clear
`all` returns the entire database as a Record.  
Make sure to use await before
```typescript
console.log( await database.all() ); // ->
// {
//   '1': '2',
//   key: 'value',
//   user_723: {
//     name: 'John Doe',
//     age: 30,
//     email: 'johndoe@example.com',
//     address: {
//       street: '123 Main St',
//       city: 'Anytown',
//       state: 'CA',
//       zip: '12345'
//     }
//   }
// }
```

`clear` clears the entire database and replaces it with {}.  
You need to confirm it when writing the function.
```typescript
await db.clear(true) // -> `true` is to confirm
```

## What are "dot directories"?
Dot directories are kind of like paths. For example insead of doing this:
```typescript
database.set("player", { health: 100 })
```
You can just simply do this:
```typescript
database.set("player.health", 100)
```
Those two will have the same result.  
You can use those "dot direcotries" on all functions.
