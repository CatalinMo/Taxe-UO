import { ConfigurationService } from './services/configuration.service';

export function ConfigLoaderFactory(configService: ConfigurationService) {
    return () => configService.loadConfig();
}
