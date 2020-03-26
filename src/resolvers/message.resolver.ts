import {
  Resolver,
  Query,
  Args,
  Mutation,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import RepoService from 'src/repo.service';
import { Message } from 'src/db/models/Message.entity';
import MessageInput, { DeleteMessageInput } from './input/message.input';
import { User } from 'src/db/models/User.entity';

@Resolver(() => Message)
class MessageResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [Message])
  public async getMessages(): Promise<Message[]> {
    return this.repoService.messageRepo.find();
  }

  @Query(() => [Message])
  public async getMessagesFromUser(
    @Args('userId') userId: number,
  ): Promise<Message[]> {
    return this.repoService.messageRepo.find({
      where: {
        userId,
      },
    });
  }

  @Query(() => Message, { nullable: true })
  public async getMessage(@Args('id') id: number): Promise<Message> {
    return this.repoService.messageRepo.findOne(id);
  }

  @Mutation(() => Message)
  public async createMessage(
    @Args('data') input: MessageInput,
  ): Promise<Message> {
    const message = this.repoService.messageRepo.create({
      content: input.content,
      userId: input.userId,
    });

    return this.repoService.messageRepo.save(message);
  }

  @Mutation(() => Message, { nullable: true })
  public async deleteMessage(
    @Args('data') input: DeleteMessageInput,
  ): Promise<Message> {
    const message = await this.repoService.messageRepo.findOne(input.id);
    if (!message) {
      return null;
    }
    const copy = { ...message };
    await this.repoService.messageRepo.remove(message);
    return copy;
  }

  @ResolveField(() => User, { name: 'user' })
  public async getUser(@Parent() parent: Message): Promise<User> {
    return this.repoService.userRepo.findOne(parent.userId);
  }
}

export default MessageResolver;
