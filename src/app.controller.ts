import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { Octokit } from 'octokit';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@UseGuards(JwtAuthGuard)
	@Get('create')
	async getCreate(@Req() req: Request) {
		// Passport automatically creates a user object, based on the value we return from the
		// `JwtAuthStrategy#validate()` method, and assigns it to the Request object as `req.user`
		console.log((req.user as any).sub);

		const octokit = new Octokit({
			auth: (req.user as any).sub,
		});

		const { login } = (await octokit.rest.users.getAuthenticated()).data;

		const repoName = `Dummy-Repo-${Math.random()}`;

		await octokit.rest.repos.createForAuthenticatedUser({
			name: repoName,
		});

		const fileContent = 'VGhpcyBmaWxlIGlzIHB1c2hlZCB0byBnaXRodWIgdXNpbmcgb2N0b2tpdC4uLg==';

		await octokit.request(`PUT /repos/${login}/${repoName}/contents/file.txt`, {
			owner: `${login}`,
			repo: `${repoName}`,
			path: 'file.txt',
			message: 'new file by octocat',
			committer: {
				name: 'Octocat bot',
				email: 'octocat@github.com',
			},
			content: `${fileContent}`,
		});

		return { repoName };
	}
}
