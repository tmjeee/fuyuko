"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyResolver = void 0;
const type_graphql_1 = require("type-graphql");
const my_domain_1 = require("./my-domain");
let MyResolver = class MyResolver {
    async myDomains() {
        return [{ id: '1' }, { id: '2' }];
    }
};
__decorate([
    type_graphql_1.Query(returns => [my_domain_1.MyDomain]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MyResolver.prototype, "myDomains", null);
MyResolver = __decorate([
    type_graphql_1.Resolver(my_domain_1.MyDomain)
], MyResolver);
exports.MyResolver = MyResolver;
