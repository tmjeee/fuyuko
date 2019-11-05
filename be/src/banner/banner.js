"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
exports.runBanner = () => {
    console.log(`
         ______                 _                 
        |  ____|               | |                
        | |__ _   _ _   _ _   _| | _____          
        |  __| | | | | | | | | | |/ / _ \\         
 _ _ _  | |  | |_| | |_| | |_| |   < (_) |  _ _ _ 
(_|_|_) |_|   \\__,_|\\__, |\\__,_|_|\\_\\___/  (_|_|_)
                     __/ |                        
                    |___/     ${config_1.default.version}                    
    
    `);
};
