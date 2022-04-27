# alkemy-fullstack-js

This project is a Full Stack Development Challenge for Alkemy company.

## Requirements

- Node js.
- npm (included in Node js).
- mysql (You can install softwares like xampp or directly mysql).
- Gmail account (nodemailer).

## Installation

Use the package manager npm to install the dependencies of the project.

```bash

npm install

```

## Usage

If you have already installed mysql, open a bash in the root of your project and run the following command:

```
mysql -u root -p
```

And enter your password when asked.

When you logged in successfully, run the content of file /src/database/db.sql. If there is a block of lines, run it all together.

```bash
CREATE DATABASE alkemy_fullstack_js;
```

```bash
CREATE TABLE clients (
  ID_CLIENT int(11) NOT NULL,
  EMAIL varchar(30) NOT NULL,
  PASSWORD varchar(60) NOT NULL,
  FULLNAME varchar(30) NOT NULL,
  IS_VERIFIED tinyint(1) NOT NULL DEFAULT 0
);
```

### Create database from phpmyadmin

If you are using a software like xampp, create a database that looks like:

#### Tables

![Tables](/assets/tables.png)

#### Clients table

![Clients table](/assets/clients.png)

#### Expenses table

![Expenses table](/assets/expenses.png)

#### Income table

![Income table](/assets/income.png)

***

Once you have your database, create a file '.env' in the root of the project and add the following variables:

```
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DATABASE=
SESSION_SECRET=
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
```

Fill in those variables with your own info:
- PORT: the port number you want to run your program on.
- DB_HOST: localhost.
- DB_USER: root.
- DB_PASSWORD: blank or your password if you set it before.
- DATABASE: alkemy_fullstack_js.
- SESSION_SECRET: the word or phrase you want without special characters
- NODEMAILER_EMAIL: your gmail account
- NODEMAILER_PASSWORD: your google app password.

To obtain a google app password, go to [Google account](https://myaccount.google.com/) > [Security](https://myaccount.google.com/security) > [2-Step verification](https://myaccount.google.com/signinoptions/two-step-verification/enroll-welcome) and activate it.
Then, go back, click on App passwords, select app 'Other' and generate one with the name you want. With that password you are able to use nodemailer system.

When you complete these two steps, open a bash in the root of the project again and run:

```bash
npm start
```

Then, enter to your browser and navigate to "localhost:" and the port you set before, for example "localhost:3000".

## Example

If you want to see an example of this project working and online, go to [alkemy-challenge-fullstack.herokuapp.com](https://alkemy-challenge-fullstack.herokuapp.com).

You can create your own account or use the trial one, whose data is (respect uppercase and lowercase):
- email: test@test.com
- password: Test1234