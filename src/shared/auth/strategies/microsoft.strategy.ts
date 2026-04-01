import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { OAuthService } from '../services/oauth.service';

export interface MicrosoftProfile {
  id: string;
  displayName: string;
  emails: Array<{ type: string; value: string }>;
  _json: {
    id: string;
    displayName: string;
    mail: string;
    userPrincipalName: string;
  };
}

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly configService: ConfigService,
    private readonly oauthService: OAuthService,
  ) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID', ''),
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>(
        'MICROSOFT_CALLBACK_URL',
        'http://localhost:3011/auth/microsoft/callback',
      ),
      scope: ['user.read'],
      tenant: configService.get<string>('MICROSOFT_TENANT', 'common'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: MicrosoftProfile,
    done: (error: Error | null, user?: unknown) => void,
  ): Promise<void> {
    const { id, displayName, emails, _json } = profile;
    const email =
      emails?.[0]?.value ?? _json?.mail ?? _json?.userPrincipalName;

    const user = await this.oauthService.buscarOuCriarUserPorOAuth({
      provider: 'microsoft',
      providerId: id,
      email,
      name: displayName,
      accessToken,
      refreshToken,
    });

    done(null, user);
  }
}
