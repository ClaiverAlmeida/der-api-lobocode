import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { OAuthService } from '../services/oauth.service';

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
  provider: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly oauthService: OAuthService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID', '');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET', '');
    const callbackURL = configService.get<string>(
      'GOOGLE_CALLBACK_URL',
      'http://localhost:3000/auth/google/callback',
    );

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    if (!this.configService.get<string>('GOOGLE_CLIENT_ID') || !this.configService.get<string>('GOOGLE_CLIENT_SECRET')) {
      done(new Error('Google OAuth configuration is missing'));
      return;
    }

    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const picture = photos?.[0]?.value;

    const user = await this.oauthService.buscarOuCriarUserPorOAuth({
      provider: 'google',
      providerId: id,
      email,
      name: displayName,
      picture,
      accessToken,
      refreshToken,
    });

    done(null, user);
  }
}
