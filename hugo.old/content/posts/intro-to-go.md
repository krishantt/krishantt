+++
title = 'Introduction To Golang'
date = 2024-06-01T18:06:12+05:45
draft = false
showtoc = true
tocopen = false
tags = ['60DaysOfLearning2024','LearningWithLeapfrog','Go']
+++

## Introduction

**This is a part of #60DaysOfLearning challenge by Leapfrog.**

I want to start my journey with DevOps. So, I am starting with learning Go. I will explore Go in depth for this week and move on to more tools.

Go has become a de facto language for cloud orchestration and software in the larger world.(from Kubernetes to Docker). I used to do Python. But seems like Python has some problems at scale, from running out of memory to The Global Interpreter Lock|(GIL) preventing true multi threading. And, the runtime errors due to dynamic typing are a bit of pain.

This is a collection of things I learned today.

This post assumes you have knowledge of at least one programming language, preferably C and/or Python.

## Package Management

Go divides programs into packages, and all go files in a directory must belong to the same package.

Declaring a package is as simple as the following:

```go
package main
```

`package main` is special. All other package names declare a package that must be imported into another package to be used. Package main will declare `func main()`, which is the starting point for a binary to run.

Let's say you have a directory structure as follows:

```go
mypackage/
	file1.go
	file2.go
```

Then, `file1.go` and `file2.go` should have the following:

```go
package main
```

When `mypackage` is imported by another package, it will include everything declared in all files in the `mypackage` directory.

To import a package, you basically have two general types.Standard library packages stand out because they don't list some repository information in their path, such as the following:

```go
"fmt"
"encoding/json"
"archive/zip"
```

All other packages generally have repository information preceding them, as follows:

```go
"github.com/johnsiilver/golib/lru"
"github.com/kylelemons/godebug/pretty"
```

And every imported package must be used at least once, otherwise if you need to do a _side effects_ import, in which just loading the package causes something to happen, but you don't
use the package. This should always be done in package main and requires prepending with an underscore (\_):

```go
package main
import (
  "fmt"
  _ "github.com/kylelemons/godebug/pretty"//Just an example
)
func main() {
 fmt.Println("Hello, playground")
}
```

## A basic Hello World program

```go
package main

import "fmt"

func main() {
	hello := "Hello World!"
	fmt.Println(hello)
}
```

Here := means create a variable and assign the string value to it. You could use `var hello` to just initialize. Go syntax is similar to C and scopes are defined with curly braces.

## Zero Values

In some older languages, a variable declaration without an assignment has an unknown value. This is because the program creates a place in memory to store the value but doesn't put anything in it. So, the bits representing the value are set to whatever happened to be in that memory space before you created the variable. But in Go, declaring a variable without an assignment automatically assigns a value called the _zero value_.

![Zero Values in Go](/posts/images/intro-to-go.png)

## Function/statement variable should be used

The rule here is that if you create a variable within a function or statement, it must be used. This is much for the same reason as package imports; declaring a variable that isn't used is almost always a mistake.

This can be relaxed in much the same way as an import, using \_.

```go
_ = someVar
```

## Looping, Branching, and Functions

As it is just some syntactical changes, I will not be discussing these in the post.

However, as in Python, functions in Go supports multiple variables to return.

```go
package main

import "fmt"

func divide(num, div int) (res, rem int) {
	result = num / div
	remainder = num % div
	return res, rem
}

func main() {
	result, remainder := divide(3, 2)
	fmt.Printf("Result: %d, Remainder %d", result, remainder)
}
```

### Varidac Arguments

A _variadic argument_ is when you want to provide 0 to infinite arguments. A good example would be calculating a sum of integers.

Here is an example:

```go
package main

import "fmt"

func sum(nums ...int) {
    total := 0
    for _, num := range nums {
        total += num
    }
    fmt.Println(total)
}

func main() {
    sum(1, 2)
    sum(1, 2, 3)
}

```

In this example, `nums` is a slice of integers. The `range` keyword is used to iterate over each element of the `nums` .

### Anonymous Functions

Go has a concept of **anonymous functions**, which means a function without a name (also called a function closure).

```go
func main() {
	result := func(word1, word2 string) string {
							return word1 + " " + word2
				 }("hello", "world")
	fmt.Println(result)
}
```

### Defining Private and Public

Just remember a rule: To be public, the constant/variable/function/method must simply start with an uppercase letter. If it starts with a lowercase letter, it is private.

## Structures, Methods and Pointers

Go supports the use of pointers, as every call to a function is call by value, it is necessary. However, in most use cases, we need not go overboard with pointers. Structures and methods are defined as the code example below.

```go
type Record struct{
 Name string
 Age int
}
// a method for the struct
func (r Record) String() string {
 return fmt.Sprintf("%s,%d", r.Name, r.Age)
}
```

And, Go doesn't provide any specialized code for that, instead, we use a constructor pattern using simple functions.

```go
func NewRecord(name string, age int) (*Record, error) {
	if name == "" {
		return nil, fmt.Errorf("name cannot be the empty string")
	}
	if age <= 0 {
		return nil, fmt.Errorf("age cannot be <= 0")
	}
	return &Record{Name: name, Age: age}, nil
}
```

This can be then implemented in code as:

```go
rec, err := NewRecord("John Doak", 100)
 if err != nil {
 return err
}
```

We will explore errors in the coming days.

## Understanding Interface in GO

In Go, an interface is a set of method signatures. When a type provides the definition for all the methods in the interface, it is said to implement the interface. It provides a way to achieve runtime polymorphism. An interface can be defined using the `type` keyword, followed by the name of the interface and the `interface` keyword.

Here is an example:

```go
type Writer interface {
	Write([]byte) (int, error)
}

```

In this example, any type that defines a method `Write` with the exact signature is said to satisfy the `Writer` interface. Interfaces can be embedded in other interfaces to create composite interfaces.

```go
type Reader interface {
	Read([]byte) (int, error)
}

type Writer interface {
	Write([]byte) (int, error)
}

type ReadWriter interface {
	Reader
	Writer
}

```

In this case, any type that satisfies both `Reader` and `Writer` interfaces satisfies the `ReadWriter` interface. Remember, Go interfaces are implemented implicitly, so there's no need to explicitly declare that a type implements an interface.

## Conclusion

As we've explored in this post, understanding Go's package management, functions, loops, and interfaces provides a solid foundation for diving deeper into the language in the further days. Feel free to suggest changes in the article and look out for more posts.
