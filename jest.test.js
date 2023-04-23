


const {server} = require("./server")

const request = require("supertest")




describe("/login", () => {




    describe("/login", () => {




        test(" login with right credentials and right type", async () => {




            const response = await request(server).post("/childlogin").send({

                email:"c1@gmail.com",

                type:"children",

                password:"Asdf@12345"

            })

            console.log(response.body)

            expect(response.body[2].okay).toEqual(true)

        })

        

        test(" login with wrong credentials and correct type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"candidate1@gmail.com",

                type:"children",

                password:"asddddddf"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })




        test(" login with right credentials and wrong type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"child1@gmail.com",

                type:"admin",

                password:"Asdf@12345"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })




        test(" login with wrong credentials and wrong type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"child1@gmail.com",

                type:"admin",

                password:"As345"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })

        

        test(" login with empty email and right type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"",

                type:"children",

                password:"asdf"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })




        test(" login with empty email and wrong type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"",

                type:"admin",

                password:"asdf"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })

        

        test(" login with empty password and correct type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"candidate1@gmail.com",

                type:"children",

                password:""

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })




          

        test(" login with empty password and wrong type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"candidate1@gmail.com",

                type:"children",

                password:""

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })




        test(" login with parent credentials and child type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"parent3@gmail.com",

                type:"children",

                password:"Asdf@12345"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })




        test(" login with parent credentials and admin type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"parent3@gmail.com",

                type:"admin",

                password:"Asdf@12345"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })





        test(" login with child credentials and parent type", async () => {




            const response = await request(server).post("/postlogin").send({
 
                email:"child1@gmail.com",

                type:"parent",

                password:"Asdf@12345"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })




        test(" login with child credentials and admin type", async () => {




            const response = await request(server).post("/postlogin").send({

                email:"child1@gmail.com",

                type:"parent",

                password:"Asdf@12345"

            })

            console.log(response.body)

            expect(response.body.okay).toEqual(undefined)




        })

    })

    




})





