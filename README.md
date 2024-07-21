# NextJs Ultimate SaaS

`TODO badges`

`TODO image that represents it all`

Have many clients in one single repo and deploy in one single machine(or many)

## Why 🤔

The possibility to deploy all clients in one single vm is mainly about cost 💵, one NextJs machine can handle a lot of work and thus is optimal to start as a new product with a few clients.

Then when it grows you can finally give each client its own vm

## How 👨‍💻

The trick here is to use [middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) in conjunction with a `Header`
(e.g: X-App-Client) and use that to `mask` a [generic  route](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) with [redirect and rewrite](https://nextjs.org/docs/app/building-your-application/routing/middleware#nextresponse) 

## Features 📃

- Single deployment mode
- Instances deployment mode
- Ansible for deploy
- Containerized Application
- Github action to automate
- Factories for each page
- Theme context strategy
- Chewed out scripts in Makefile

## [File tree 🌲](<https://tree.nathanfriend.io/?s=(%27options!(%27fancy!true~fullPath6~trailingSlash6~rootDot6)~B(%27B%27F3Jorkflows*..F%20actions3ansible-8%20...8src*appR%5Bc9%5DR05K4SINGLE*5s24INSTANCES*7RQsR05%207%20factories*middlewarHmagic*C9InterfacHc9KstrategyO%20routing%2C%20theming3Makefile2all%20you%20need%27)~version!%271%27)*300%20%202O-%203%5Cn4usedJhen%205...Q6!false7components8playbooks39lientBsource!F.githubHe.ts2J%20wKs%20O%20-QpageR*0%01RQOKJHFB987654320*>)

```
.github
└── workflows
    └── ...github actions
ansible-playbooks
└── ...playbooks
src
├── app
│   └── [client]
│       └── ...pages used when SINGLE
├── ...pages -- used when INSTANCES
├── components
│   └── pages
│       └── ...page components factories
├── middleware.ts -- magic
└── ClientInterface.ts -- clients strategy - routing, theming
Makefile -- all you need
```

## Architecture 🎨

`TODO diagrams`

### base sketch

<img src='/static/basesketch.png'/>

### example

<img src='/static/foobazbar.jpg'/>

## TODO:

-   [ ] [Infrastructure as code](https://developer.hashicorp.com/terraform?product_intent=terraform)
-   [ ] [Document Makefile better](https://gist.github.com/prwhite/8168133?permalink_comment_id=4160123) 
