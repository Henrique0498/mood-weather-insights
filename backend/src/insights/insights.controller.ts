import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { InsightsService } from "./insights.service";
import { CreateInsightsDto } from "./dto/create-insights.dto";
import { FindInsightsDto } from "./dto/find-insights.dto";
import { UUID } from "crypto";
import { FindRecentTopicsDto } from "./dto/find-recent-topics.dto";
import { DeleteTopicDto } from "./dto/delete-topic.dto";

@Controller("insights")
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post()
  create(@Body() dto: CreateInsightsDto) {
    return this.insightsService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindInsightsDto) {
    return this.insightsService.findAll(query);
  }

  @Get("topics")
  findTopics(@Query() query: FindRecentTopicsDto) {
    return this.insightsService.findTopics({
      userId: query.userId,
      limit: query.limit ?? 2,
    });
  }

  @Delete("topics")
  clearTopics(@Body() data: DeleteTopicDto) {
    return this.insightsService.removeTopic(data);
  }

  @Get(":id")
  findOne(@Param("id") id: UUID) {
    return this.insightsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: UUID) {
    return this.insightsService.remove(id);
  }
}
