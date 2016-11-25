### Default approach

* *constructor* -> *componentDidMount* time ~ 3.222sec

| (index)  | Owner > Component     | Inclusive render time (ms) | Instance count | Render count |
|----------|-----------------------|----------------------------|----------------|--------------|
| 0        | "App"                 | 596.33                     | 1              | 1            |
| 1        | "App > Perfomance"    | 596.18                     | 1              | 1            |
| 2        | "Perfomance > Button" | 332.78                     | 20000          | 20000        |

## Higher order components

* *constructor* -> *componentDidMount* time ~ 5.23sec

| (index)  | Owner > Component     | Inclusive render time (ms) | Instance count | Render count |
|----------|-----------------------|----------------------------|----------------|--------------|
| 0        |"App                   | 874.02                     | 1              | 1            |
| 1        |"App > Perfomance      | 873.88                     | 1              | 1            |
| 2        |"Perfomance > Unknown  | 599.1                      | 20000          | 20000        |
| 3        |"Unknown > Unknown     | 271.7                      | 20000          | 20000        |
| 4        |"Unknown > Button      | 132.49                     | 20000          | 20000        |


## Forged components

* *constructor* -> *componentDidMount* time ~ 5.02src

| (index)  | Owner > Component           | Inclusive render time (ms) | Instance count | Render count |
|----------|-----------------------------|----------------------------|----------------|--------------|
| 0        | "App"                       | 985.01                     | 1              | 1            |
| 1        | "App > Perfomance"          | 984.87                     | 1              | 1            |
| 3        | "Perfomance > Button"       | 148.52                     | 20000          | 20000        |
| 2        | "Perfomance > ForgedButton" | 725.21                     | 20000          | 20000        |

## Recompose components

* *constructor* -> *componentDidMount* time ~ 5.02src

| (index)  | Owner > Component           | Inclusive render time (ms) | Instance count | Render count |
|----------|-----------------------------|----------------------------|----------------|--------------|
