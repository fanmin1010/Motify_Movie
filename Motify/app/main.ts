// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./modules/app.module";

import * as tnsOAuthModule from 'nativescript-oauth';

var facebookInitOptions: tnsOAuthModule.ITnsOAuthOptionsFacebook = {
    clientId: '415882822127443',
    clientSecret: 'eb72b953acb4507053b2f9709eab357d',
    scope: ['email']
};

tnsOAuthModule.initFacebook(facebookInitOptions);

platformNativeScriptDynamic().bootstrapModule(AppModule);