import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { GENERAL_CHARACTER } from '../const/general-character.const';
import { CharacterSkillOrchestratorService } from '../services/skill/character-skill-orchestrator.service';
import { CharacterSkillController } from './character-skill.controller';
import { UNIQUE_ID_SKILLS } from 'netim2-shared';

describe('CharacterSkillController speciality selection HTTP', () => {
    let app: INestApplication;
    let authenticated: boolean;
    const response = { speciality: 'Corporal', skills: [], stats: GENERAL_CHARACTER.stats, attributes: GENERAL_CHARACTER.atributos };
    const service = { selectSpeciality: jest.fn(), getSpecialitySkills: jest.fn(), getUpgradePreview: jest.fn(), upgradeSkill: jest.fn() };
    beforeAll(async () => {
        const module = await Test.createTestingModule({ controllers: [CharacterSkillController],
            providers: [{ provide: CharacterSkillOrchestratorService, useValue: service }] })
            .overrideGuard(AccessTokenGuard).useValue({ canActivate(context) {
                if (!authenticated) throw new UnauthorizedException();
                context.switchToHttp().getRequest().user = { accountId: 'owner' };
                return true;
            } }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    beforeEach(() => {
        authenticated = true;
        service.selectSpeciality.mockReset().mockResolvedValue(response);
        service.getUpgradePreview.mockReset().mockResolvedValue({ next: null, canUpgrade: false, cost: null });
    });
    afterAll(async () => { await app?.close(); });

    it('uses the authenticated account and forwards only the requested speciality', async () => {
        const result = await request(app.getHttpServer()).post('/character/character-id/skills/select-speciality')
            .send({ speciality: 'Corporal', accountId: 'forged', lv: 99, hab: [] }).expect(200);
        expect(result.body).toEqual(JSON.parse(JSON.stringify({ data: response })));
        expect(service.selectSpeciality).toHaveBeenCalledWith('character-id', 'owner', { speciality: 'Corporal' });
    });

    it.each([{}, { speciality: 'corporal' }, { speciality: null }, { speciality: 1 }, { speciality: ['Corporal'] }])(
        'rejects invalid bodies %o before the orchestrator', async body => {
            await request(app.getHttpServer()).post('/character/id/skills/select-speciality').send(body).expect(400);
            expect(service.selectSpeciality).not.toHaveBeenCalled();
        },
    );

    it('requires authentication', async () => {
        authenticated = false;
        await request(app.getHttpServer()).post('/character/id/skills/select-speciality').send({ speciality: 'Corporal' }).expect(401);
        expect(service.selectSpeciality).not.toHaveBeenCalled();
    });

    it('exposes authenticated preview and strips forged progression/resources', async () => {
        await request(app.getHttpServer()).post('/character/id/skills/upgrade-preview')
            .send({ skillId: UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS, accountId: 'forged', lv: 10, mastery: 'G', puntos_habilidad: 100 }).expect(200);
        expect(service.getUpgradePreview).toHaveBeenCalledWith('id', 'owner', { skillId: UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS });
    });

    it.each([{}, { skillId: '13' }, { skillId: -1 }, { skillId: 999999 }, { skillId: null }])('rejects invalid preview payload %o', async body => {
        await request(app.getHttpServer()).post('/character/id/skills/upgrade-preview').send(body).expect(400);
        expect(service.getUpgradePreview).not.toHaveBeenCalled();
    });

    it('passes only the validated skill ID and authenticated account to the upgrade', async () => {
        const skillId = UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS;
        service.upgradeSkill.mockResolvedValueOnce({ puntos_habilidad: 0, updatedItems: [] });
        await request(app.getHttpServer()).post('/character/id/skills/upgrade')
            .send({ skillId, accountId: 'forged', cost: 0 }).expect(200);
        expect(service.upgradeSkill).toHaveBeenCalledWith('id', 'owner', { skillId });
    });

    it('requires authentication for preview', async () => {
        authenticated = false;
        await request(app.getHttpServer()).post('/character/id/skills/upgrade-preview').send({ skillId: UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS }).expect(401);
        expect(service.getUpgradePreview).not.toHaveBeenCalled();
    });
});
