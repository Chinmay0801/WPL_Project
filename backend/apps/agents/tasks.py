"""
Celery tasks for AI agent pipeline.

These tasks are triggered when a new research report is created.
Each task runs asynchronously via Celery + Redis.
"""
from celery import shared_task
from django.utils import timezone


@shared_task(bind=True, max_retries=3)
def run_research_pipeline(self, report_id):
    """
    Main orchestrator task — kicks off the multi-agent research pipeline.

    Flow:
    1. Fetch market data for the ticker
    2. Run fundamental analysis agent
    3. Run sentiment analysis agent
    4. Run risk assessment agent
    5. Run valuation agent
    6. Combine results into final report
    """
    from apps.research.models import ResearchReport
    from apps.agents.models import AgentRun

    try:
        report = ResearchReport.objects.get(id=report_id)
        report.status = 'in_progress'
        report.save()

        # TODO: Implement each agent step
        # This is a placeholder for the multi-agent pipeline
        agents_to_run = ['fundamental', 'sentiment', 'risk', 'valuation']

        for agent_type in agents_to_run:
            agent_run = AgentRun.objects.create(
                report=report,
                agent_type=agent_type,
                status='pending',
            )
            # TODO: Call LangChain/LlamaIndex agent here
            agent_run.status = 'completed'
            agent_run.completed_at = timezone.now()
            agent_run.save()

        report.status = 'completed'
        report.summary = 'Research pipeline completed successfully.'
        report.save()

    except Exception as exc:
        report.status = 'failed'
        report.save()
        raise self.retry(exc=exc, countdown=60)
