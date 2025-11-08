
---

Are you getting `cannot call non-const associated function hashmap in statics` and for the `mutex` `static mutex has no body` for the `hashmap` we use `lazy_static`.

Here's how to fix 'em:

The wrong way of declaring `Mutex` and `HashMap`:

```rust
static mut mtx: Mutex<()>;
static mut curDirNum: HashMap<String, u64> = HashMap::new();
```

```rust
// In the headers

#[macro use]
extern crate lazy_static
use std::collections::HashMap;
use std::sync::Mutex;

// Globals
static mut mtx: Mutex<i32> = Mutex::new(0);
lazy_static! {
  static ref curDirNum: Mutex<HashMap<String, u64>> = Mutex::new(HashMap::new());
}
```

And in your `Cargo.toml`:

```rust
[dependencies]
lazy_static = "1.5.0"
```
