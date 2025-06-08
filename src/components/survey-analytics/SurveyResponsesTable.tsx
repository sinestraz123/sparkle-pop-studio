
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/survey/SurveyLoadingSpinner';

interface SurveyResponsesTableProps {
  surveyId: string;
}

interface ResponseData {
  session_id: string;
  created_at: string;
  responses: Array<{
    question_text: string;
    response: any;
    question_type: string;
  }>;
}

export const SurveyResponsesTable = ({ surveyId }: SurveyResponsesTableProps) => {
  const { data: responses, isLoading, error } = useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: async () => {
      if (!surveyId) return [];

      // Get all responses for this survey with question details
      const { data, error } = await supabase
        .from('survey_responses')
        .select(`
          *,
          survey_questions (
            question_text,
            question_type
          )
        `)
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group responses by session_id
      const groupedResponses: { [key: string]: ResponseData } = {};
      
      data?.forEach((response) => {
        const sessionId = response.session_id || 'anonymous';
        
        if (!groupedResponses[sessionId]) {
          groupedResponses[sessionId] = {
            session_id: sessionId,
            created_at: response.created_at,
            responses: []
          };
        }

        groupedResponses[sessionId].responses.push({
          question_text: response.survey_questions?.question_text || 'Unknown Question',
          response: response.response_data,
          question_type: response.survey_questions?.question_type || 'unknown'
        });
      });

      return Object.values(groupedResponses);
    },
    enabled: !!surveyId,
  });

  const formatResponse = (response: any, questionType: string) => {
    if (typeof response === 'string') return response;
    if (typeof response === 'number') return response.toString();
    if (Array.isArray(response)) return response.join(', ');
    if (typeof response === 'object' && response !== null) {
      return JSON.stringify(response);
    }
    return 'No response';
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">Error loading responses: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
          <CardDescription>View all collected survey responses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No responses collected yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Responses</CardTitle>
        <CardDescription>
          {responses.length} response session{responses.length !== 1 ? 's' : ''} collected
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {responses.map((sessionData, index) => (
            <div key={sessionData.session_id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Response #{index + 1}</h3>
                  <p className="text-sm text-gray-500">
                    Session ID: {sessionData.session_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(sessionData.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant="outline">
                  {sessionData.responses.length} answer{sessionData.responses.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionData.responses.map((responseItem, responseIndex) => (
                    <TableRow key={responseIndex}>
                      <TableCell className="font-medium max-w-xs">
                        {responseItem.question_text}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {responseItem.question_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md break-words">
                        {formatResponse(responseItem.response, responseItem.question_type)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
