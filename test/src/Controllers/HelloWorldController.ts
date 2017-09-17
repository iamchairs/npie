
import { Controller, Get } from "../../../npie";

@Controller('HelloWorld')
export class HelloWorldController {

    @Get()
    public get() {
        return "Hello World";
    }
    
}