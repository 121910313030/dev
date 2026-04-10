from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Resume, ResumeBatch
from django.db.models import Count, Avg

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_overview(request):
    # Optimized query to get batches and user emails in one go
    batches = ResumeBatch.objects.select_related('user').annotate(
        resume_count=Count('resumes'),
        average_score=Avg('resumes__score')
    ).order_by('-created_at')

    # global_top_3 = Resume.objects.select_related('batch__user').order_by('-score')[:3]

    batch_list = []
    for b in batches:
        batch_list.append({
            "id": b.id,
            "processed_by": b.user.email if b.user else "System",
            "date": b.created_at.strftime("%Y-%m-%d %H:%M"),
            "count": b.resume_count,
            "avg_score": round(b.average_score or 0, 1)
        })

    # top_3_list = [{
    #     "name": r.resume_file.name.split('/')[-1] if r.resume_file else "Unknown",
    #     "score": r.score,
    #     "processed_by": r.batch.user.email if (r.batch and r.batch.user) else "System"
    # } for r in global_top_3]

    return Response({
        "batches": batch_list,
        # "top3": top_3_list,
        "stats": {
            "total_processed": Resume.objects.count(),
            "flagged_low_confidence": Resume.objects.filter(confidence_level='low').count()
        }
    })